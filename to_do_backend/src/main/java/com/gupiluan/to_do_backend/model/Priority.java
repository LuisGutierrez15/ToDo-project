
package com.gupiluan.to_do_backend.model;

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
}
