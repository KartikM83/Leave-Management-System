package org.kartikmankar.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;


    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    private String managerComment;



}
