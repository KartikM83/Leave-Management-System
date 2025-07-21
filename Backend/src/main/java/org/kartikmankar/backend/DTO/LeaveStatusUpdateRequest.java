package org.kartikmankar.backend.DTO;

import lombok.Data;

@Data
public class LeaveStatusUpdateRequest {
    private String status;
    private String managerComment;
}