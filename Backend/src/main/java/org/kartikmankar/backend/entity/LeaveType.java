package org.kartikmankar.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum LeaveType {

    SICK ,
    VACATION,
    OTHER,

}

