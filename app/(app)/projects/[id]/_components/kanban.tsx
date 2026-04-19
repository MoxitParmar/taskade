/* eslint-disable unicorn/no-null */
"use client";

import { Trash2Icon } from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";



import {
  KanbanBoard,
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardButtonGroup,
  KanbanBoardCardDescription,
  KanbanBoardCardTextarea,
  KanbanBoardColumn,
  KanbanBoardColumnButton,
  KanbanBoardColumnFooter,
  KanbanBoardColumnHeader,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  kanbanBoardColumnListItemClassNames,
  KanbanBoardColumnSkeleton,
  KanbanBoardColumnTitle,
  KanbanBoardProvider,
  KanbanColorCircle,
  useDndEvents,
} from "@/components/kanban";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useJsLoaded } from "@/hooks/use-js-loaded";
import { KanbanBoardDropDirection } from "@/components/kanban";
import { KanbanBoardCircleColor } from "@/components/kanban";

// Types
export type Card = {
  id: Id<"tasks">;
  name: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  assignee?: { _id?: string; name?: string; email?: string; imageUrl?: string } | null;
  priority?: "low" | "medium" | "high" | string;
  project?: any;
};

type Column = {
  id: string;
  title: string;
  color: KanbanBoardCircleColor;
  items: Card[];
};

export type KanbanTask = {
  _id: string;
  name: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  assignee?: { _id?: string; name?: string; email?: string; imageUrl?: string } | null;
  priority?: "low" | "medium" | "high" | string;
  project?: any;
};

export default function KanbanBoardPage({
  tasks,
  onStatusChange,
  onDeleteTask,
}: {
  tasks: KanbanTask[];
  onStatusChange?: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done",
  ) => Promise<void> | void;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
}) {
  const normalizedTasks: Card[] = tasks.map((task) => ({
    id: task._id as Id<"tasks">,
    name: task.name,
    status: task.status,
    dueDate: task.dueDate,
    assignee: task.assignee,
    priority: task.priority,
    project: task.project,
  }));

  return (
    <div className="grid h-screen grid-rows-[var(--header-height)_1fr_6rem] overflow-x-hidden sm:grid-rows-[var(--header-height)_1fr_var(--header-height)]">
      <main className="relative">
        <div className="absolute inset-0 h-full ">
          <KanbanBoardProvider>
            <MyKanbanBoard tasks={normalizedTasks} onStatusChange={onStatusChange} onDeleteTask={onDeleteTask} />
          </KanbanBoardProvider>
        </div>
      </main>
    </div>
  );
}

export function MyKanbanBoard({
  tasks,
  onStatusChange,
  onDeleteTask
}: {
  tasks: Card[];
  onStatusChange?: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done",
  ) => Promise<void> | void;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
}) {
  const [columns, setColumns] = useState<Column[]>([]);
  // Track pending updates for task ids to avoid overwriting optimistic moves
  const pendingUpdatesRef = useRef<Set<string>>(new Set());

  // Map incoming tasks into three columns by status
  useEffect(() => {
    const statuses: {
      id: Column["id"];
      title: string;
      color: Column["color"];
    }[] = [
      { id: "todo", title: "To Do", color: "blue" },
      { id: "in-progress", title: "In Progress", color: "yellow" },
      { id: "done", title: "Done", color: "green" },
    ];

    // Keep optimistic/pending items in their current columns instead of
    // letting an incoming `tasks` update overwrite them.
    const pendingIds = new Set(Array.from(pendingUpdatesRef.current));

    const baseColumns: Column[] = statuses.map((s) => ({
      id: s.id,
      title: s.title,
      color: s.color,
      items: tasks.filter(
        (t) => t.status === s.id && !pendingIds.has(String(t.id)),
      ),
    }));

    const nextColumns: Column[] = baseColumns.map((col) => {
      const pendingItems =
        columns
          .find((c) => c.id === col.id)
          ?.items.filter((it) => pendingIds.has(String(it.id))) ?? [];
      return { ...col, items: [...col.items, ...pendingItems] };
    });

    setColumns(nextColumns);
  }, [tasks]);

  async function handleDeleteCard(cardId: string) {
    // Optimistic remove: snapshot previous columns and remove immediately.
    const previousColumns = columns.map((c) => ({ ...c, items: [...c.items] }));

    setColumns((previousColumnsState) =>
      previousColumnsState.map((column) =>
        column.items.some((card) => card.id === cardId)
          ? { ...column, items: column.items.filter(({ id }) => id !== cardId) }
          : column,
      ),
    );

    try {
      await onDeleteTask?.(cardId);
      toast.success("Task deleted");
    } catch (error) {
      setColumns(previousColumns);
      toast.error("Failed to delete task");
    }

    // Call server mutation and rollback on failure.
    // (async () => {
    //   if (cardId && onDeleteTask ) {
    //     await onDeleteTask( cardId);
    //   }
    //   // try {
    //   //   await deleteTask({ taskId: cardId as Id<"tasks"> });
    //   //   toast.success("Task deleted");
    //   // } catch (err) {
    //   //   // Rollback local state on failure
    //   //   setColumns(previousColumns);
    //   //   toast.error("Failed to delete task");
    //   // }
    // })();
  }

  function handleMoveCardToColumn(columnId: string, index: number, card: Card) {
    const newStatus = columnId as Card["status"];
    const updatedCard = { ...card, status: newStatus };

    // Capture a snapshot so we can rollback if the server call fails.
    const prevColumnsSnapshot = columns.map((c) => ({
      ...c,
      items: [...c.items],
    }));

    // Mark this card as pending to avoid overriding by incoming `tasks`.
    pendingUpdatesRef.current.add(String(card.id));

    // Apply optimistic move locally.
    setColumns((previousColumns) =>
      previousColumns.map((column) => {
        if (column.id === columnId) {
          const updatedItems = column.items.filter(({ id }) => id !== card.id);
          return {
            ...column,
            items: [
              ...updatedItems.slice(0, index),
              updatedCard,
              ...updatedItems.slice(index),
            ],
          };
        } else {
          return {
            ...column,
            items: column.items.filter(({ id }) => id !== card.id),
          };
        }
      }),
    );

    // Persist change via callback; rollback on rejection.
    if (onStatusChange && card.status !== newStatus) {
      try {
        const result = onStatusChange(String(card.id), newStatus);
        if (result && typeof (result as Promise<void>).then === "function") {
          (result as Promise<void>)
            .then(() => {
              pendingUpdatesRef.current.delete(String(card.id));
            })
            .catch(() => {
              // rollback
              pendingUpdatesRef.current.delete(String(card.id));
              setColumns(prevColumnsSnapshot);
            });
        } else {
          // Synchronous callback — clear pending flag.
          pendingUpdatesRef.current.delete(String(card.id));
        }
      } catch (err) {
        pendingUpdatesRef.current.delete(String(card.id));
        setColumns(prevColumnsSnapshot);
      }
    } else {
      // No remote callback; clear pending marker.
      pendingUpdatesRef.current.delete(String(card.id));
    }
  }

  /*
  Moving cards with the keyboard.
  */
  const [activeCardId, setActiveCardId] = useState<string>("");
  const originalCardPositionReference = useRef<{
    columnId: string;
    cardIndex: number;
  } | null>(null);
  const { onDragStart, onDragEnd, onDragCancel, onDragOver } = useDndEvents();

  // This helper returns the appropriate overId after a card is placed.
  // If there's another card below, return that card's id, otherwise return the column's id.
  function getOverId(column: Column, cardIndex: number): string {
    if (cardIndex < column.items.length - 1) {
      return column.items[cardIndex + 1].id;
    }

    return column.id;
  }

  // Find column and index for a given card.
  function findCardPosition(cardId: string): {
    columnIndex: number;
    cardIndex: number;
  } {
    for (const [columnIndex, column] of columns.entries()) {
      const cardIndex = column.items.findIndex((c) => c.id === cardId);

      if (cardIndex !== -1) {
        return { columnIndex, cardIndex };
      }
    }

    return { columnIndex: -1, cardIndex: -1 };
  }

  function moveActiveCard(
    cardId: string,
    direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown",
  ) {
    const { columnIndex, cardIndex } = findCardPosition(cardId);
    if (columnIndex === -1 || cardIndex === -1) return;

    const card = columns[columnIndex].items[cardIndex];

    let newColumnIndex = columnIndex;
    let newCardIndex = cardIndex;

    switch (direction) {
      case "ArrowUp": {
        newCardIndex = Math.max(cardIndex - 1, 0);

        break;
      }
      case "ArrowDown": {
        newCardIndex = Math.min(
          cardIndex + 1,
          columns[columnIndex].items.length - 1,
        );

        break;
      }
      case "ArrowLeft": {
        newColumnIndex = Math.max(columnIndex - 1, 0);
        // Keep same cardIndex if possible, or if out of range, insert at end
        newCardIndex = Math.min(
          newCardIndex,
          columns[newColumnIndex].items.length,
        );

        break;
      }
      case "ArrowRight": {
        newColumnIndex = Math.min(columnIndex + 1, columns.length - 1);
        newCardIndex = Math.min(
          newCardIndex,
          columns[newColumnIndex].items.length,
        );

        break;
      }
    }

    // Perform state update in flushSync to ensure immediate state update.
    flushSync(() => {
      handleMoveCardToColumn(columns[newColumnIndex].id, newCardIndex, card);
    });

    // Find the card's new position and announce it.
    const { columnIndex: updatedColumnIndex, cardIndex: updatedCardIndex } =
      findCardPosition(cardId);
    const overId = getOverId(columns[updatedColumnIndex], updatedCardIndex);

    onDragOver(cardId, overId);
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string,
  ) {
    const { key } = event;

    if (activeCardId === "" && key === " ") {
      // Pick up the card.
      event.preventDefault();
      setActiveCardId(cardId);
      onDragStart(cardId);

      const { columnIndex, cardIndex } = findCardPosition(cardId);
      originalCardPositionReference.current =
        columnIndex !== -1 && cardIndex !== -1
          ? { columnId: columns[columnIndex].id, cardIndex }
          : null;
    } else if (activeCardId === cardId) {
      // Card is already active.
      // eslint-disable-next-line unicorn/prefer-switch
      if (key === " " || key === "Enter") {
        event.preventDefault();
        // Drop the card.
        flushSync(() => {
          setActiveCardId("");
        });

        const { columnIndex, cardIndex } = findCardPosition(cardId);
        if (columnIndex !== -1 && cardIndex !== -1) {
          const overId = getOverId(columns[columnIndex], cardIndex);
          onDragEnd(cardId, overId);
        } else {
          // If we somehow can't find the card, just call onDragEnd with cardId.
          onDragEnd(cardId);
        }

        originalCardPositionReference.current = null;
      } else if (key === "Escape") {
        event.preventDefault();

        // Cancel the drag.
        if (originalCardPositionReference.current) {
          const { columnId, cardIndex } = originalCardPositionReference.current;
          const {
            columnIndex: currentColumnIndex,
            cardIndex: currentCardIndex,
          } = findCardPosition(cardId);

          // Revert card only if it moved.
          if (
            currentColumnIndex !== -1 &&
            (columnId !== columns[currentColumnIndex].id ||
              cardIndex !== currentCardIndex)
          ) {
            const card = columns[currentColumnIndex].items[currentCardIndex];
            flushSync(() => {
              handleMoveCardToColumn(columnId, cardIndex, card);
            });
          }
        }

        onDragCancel(cardId);
        originalCardPositionReference.current = null;

        setActiveCardId("");
      } else if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown"
      ) {
        event.preventDefault();
        moveActiveCard(cardId, key);
        // onDragOver is called inside moveActiveCard after placement.
      }
    }
  }

  function handleCardBlur() {
    setActiveCardId("");
  }

  const jsLoaded = useJsLoaded();

  return (
    <KanbanBoard>
      {columns.map((column) =>
        jsLoaded ? (
          <MyKanbanBoardColumn
            activeCardId={activeCardId}
            column={column}
            key={column.id}
            onCardBlur={handleCardBlur}
            onCardKeyDown={handleCardKeyDown}
            onDeleteCard={handleDeleteCard}
            onMoveCardToColumn={handleMoveCardToColumn}
          />
        ) : (
          <KanbanBoardColumnSkeleton key={column.id} />
        ),
      )}

      {/* <KanbanBoardExtraMargin /> */}
    </KanbanBoard>
  );
}

function MyKanbanBoardColumn({
  activeCardId,
  column,
  onCardBlur,
  onCardKeyDown,
  onDeleteCard,
  onMoveCardToColumn,
}: {
  activeCardId: string;
  column: Column;
  onCardBlur: () => void;
  onCardKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string,
  ) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCardToColumn: (columnId: string, index: number, card: Card) => void;
}) {
  const listReference = useRef<HTMLUListElement>(null);
  const { onDragCancel, onDragEnd } = useDndEvents();

  function scrollList() {
    if (listReference.current) {
      listReference.current.scrollTop = listReference.current.scrollHeight;
    }
  }
  function handleDropOverColumn(dataTransferData: string) {
    const card = JSON.parse(dataTransferData) as Card;
    onMoveCardToColumn(column.id, 0, card);
  }

  function handleDropOverListItem(cardId: string) {
    return (
      dataTransferData: string,
      dropDirection: KanbanBoardDropDirection,
    ) => {
      const card = JSON.parse(dataTransferData) as Card;
      const cardIndex = column.items.findIndex(({ id }) => id === cardId);
      const currentCardIndex = column.items.findIndex(
        ({ id }) => id === card.id,
      );

      const baseIndex = dropDirection === "top" ? cardIndex : cardIndex + 1;
      const targetIndex =
        currentCardIndex !== -1 && currentCardIndex < baseIndex
          ? baseIndex - 1
          : baseIndex;

      // Safety check to ensure targetIndex is within bounds
      const safeTargetIndex = Math.max(
        0,
        Math.min(targetIndex, column.items.length),
      );
      const overCard = column.items[safeTargetIndex];

      if (card.id === overCard?.id) {
        onDragCancel(card.id);
      } else {
        onMoveCardToColumn(column.id, safeTargetIndex, card);
        onDragEnd(card.id, overCard?.id || column.id);
      }
    };
  }

  return (
    <KanbanBoardColumn
      columnId={column.id}
      key={column.id}
      onDropOverColumn={handleDropOverColumn}
    >
      <KanbanBoardColumnHeader>
        <KanbanBoardColumnTitle columnId={column.id}>
          <KanbanColorCircle color={column.color} />
          {column.title}
        </KanbanBoardColumnTitle>
      </KanbanBoardColumnHeader>

      <KanbanBoardColumnList ref={listReference}>
        {column.items.map((card) => (
          <KanbanBoardColumnListItem
            cardId={card.id}
            key={card.id}
            onDropOverListItem={handleDropOverListItem(card.id)}
          >
            <MyKanbanBoardCard
              card={card}
              isActive={activeCardId === card.id}
              onCardBlur={onCardBlur}
              onCardKeyDown={onCardKeyDown}
              onDeleteCard={onDeleteCard}
            />
          </KanbanBoardColumnListItem>
        ))}
      </KanbanBoardColumnList>

      {/* Card creation UI removed (not supported) */}
    </KanbanBoardColumn>
  );
}

function MyKanbanBoardCard({
  card,
  isActive,
  onCardBlur,
  onCardKeyDown,
  onDeleteCard,
}: {
  card: Card;
  isActive: boolean;
  onCardBlur: () => void;
  onCardKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string,
  ) => void;
  onDeleteCard: (cardId: string) => void;
}) {
  const kanbanBoardCardReference = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  // This ref tracks the previous `isActive` state. It is used to refocus the
  // card after it was discarded with the keyboard.
  const previousIsActiveReference = useRef(isActive);
  // This ref tracks if the card was cancelled via Escape.
  const wasCancelledReference = useRef(false);

  useEffect(() => {
    // Maintain focus after the card is picked up and moved.
    if (isActive) {
      kanbanBoardCardReference.current?.focus();
    }

    // Refocus the card after it was discarded with the keyboard.
    if (
      !isActive &&
      previousIsActiveReference.current &&
      wasCancelledReference.current
    ) {
      kanbanBoardCardReference.current?.focus();
      wasCancelledReference.current = false;
    }

    previousIsActiveReference.current = isActive;
  }, [isActive]);

  // function handleBlur() {

  //   kanbanBoardCardReference.current?.focus();
  // }

  // function handleSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const cardTitle = formData.get("cardTitle") as string;
  //   handleBlur();
  // }

  return (
    <KanbanBoardCard
      data={card}
      isActive={isActive}
      onBlur={onCardBlur}
      onClick={() => router.push(`/task/${card.id}`)}
      onKeyDown={(event) => {
        if (event.key === " ") {
          // Prevent the button "click" action on space because that should
          // be used to pick up and move the card using the keyboard.
          event.preventDefault();
        }

        if (event.key === "Escape") {
          // Mark that this card was cancelled.
          wasCancelledReference.current = true;
        }

        onCardKeyDown(event, card.id);
      }}
      ref={kanbanBoardCardReference}
    >
      <KanbanBoardCardDescription>{card?.name}</KanbanBoardCardDescription>
      <KanbanBoardCardDescription className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">Due: {card?.dueDate ?? "—"}</span>
        <span className="truncate text-right">{card?.assignee?.name ?? "Unassigned"}</span>
      </KanbanBoardCardDescription>
      <KanbanBoardCardButtonGroup disabled={isActive}>
        <KanbanBoardCardButton
          className="text-destructive"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onDeleteCard(card.id);
          }}
        >
          <Trash2Icon />

          <span className="sr-only">Delete card</span>
        </KanbanBoardCardButton>
      </KanbanBoardCardButtonGroup>
    </KanbanBoardCard>
  );
}

// Card creation component removed — adding cards is not supported.
