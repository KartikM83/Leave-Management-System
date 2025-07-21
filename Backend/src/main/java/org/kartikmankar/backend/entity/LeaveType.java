package org.kartikmankar.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum LeaveType {
    SICK("Sick Leaves"),
    VACATION("Vacation Leaves"),
    OTHER("Other Leaves");

    private final String label;

    LeaveType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static LeaveType fromLabel(String label) {
        for (LeaveType type : LeaveType.values()) {
            if (type.getLabel().equalsIgnoreCase(label)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid leave type: " + label);
    }
}

