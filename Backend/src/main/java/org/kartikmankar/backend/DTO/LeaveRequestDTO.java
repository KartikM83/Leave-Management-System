package org.kartikmankar.backend.DTO;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kartikmankar.backend.entity.LeaveStatus;
import org.kartikmankar.backend.entity.LeaveType;
import org.kartikmankar.backend.entity.User;

import java.time.LocalDate;
import java.util.function.LongFunction;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequestDTO {

    private long id;

    @NotNull(message = "{employee.name.absent}")
    private Long employeeID;


    private LeaveType leaveType;

    @NotNull(message = "{startDate.date.absent}")
    private LocalDate startDate;

    @NotNull(message = "{endDate.date.absent}")
    private LocalDate endDate;

    @NotBlank(message = "{reason.name.absent}")
    private String reason;


    private LeaveStatus status;


    private String managerComment;

    private String employeeName;
    private String employeeCode;
    private String department;
}
