
package com.gupiluan.to_do_backend.model;

import java.util.Comparator;

/**
 * Enumeration representing the priority levels for ToDo items.
 * Defines the urgency/importance hierarchy for task management.
 * 
 * @author gupiluan
 */
public enum Priority {
    /** Highest priority - urgent and important tasks */
    HIGH(3),

    /** Medium priority - important but not urgent tasks */
    MEDIUM(2),

    /** Lowest priority - nice-to-have tasks */
    LOW(1);

    /** Rank of the priority level, used for sorting */
    private final int rank;

    Priority(int rank) {
        this.rank = rank;
    }

    public int getRank() {
        return rank;
    }

    /**
     * Comparator for sorting priorities by rank (HIGH > MEDIUM > LOW).
     * Use for descending priority order.
     */
    public static final Comparator<Priority> BY_RANK_DESC = (p1, p2) -> Integer.compare(p2.rank, p1.rank);

    /**
     * Comparator for sorting priorities by rank (LOW > MEDIUM > HIGH).
     * Use for ascending priority order.
     */
    public static final Comparator<Priority> BY_RANK_ASC = (p1, p2) -> Integer.compare(p1.rank, p2.rank);
}
