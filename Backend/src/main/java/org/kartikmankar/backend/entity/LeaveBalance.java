package org.kartikmankar.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    private int totalSickLeaves = 10;
    private int totalVacationLeaves = 10;
    private int totalOtherLeaves = 5;

    private int remainingVacationLeaves;
    private int remainingSickLeaves;

    private int otherLeavesRemaining;



}
