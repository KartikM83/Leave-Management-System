package org.kartikmankar.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveSummaryDTO {
    private int totalSick;
    private int approvedSick;
    private int totalVacation;
    private int approvedVacation;
    private int totalOther;
    private int approvedOther;
    private int totalApproved;
    private int totalAllotted;
    private int totalRemaining;
    private int approvedCount;
    private int rejectedCount;
    private int pendingCount;

}
