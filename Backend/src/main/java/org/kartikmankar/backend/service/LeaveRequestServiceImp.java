package org.kartikmankar.backend.service;

import org.kartikmankar.backend.DTO.LeaveRequestDTO;
import org.kartikmankar.backend.DTO.LeaveSummaryDTO;
import org.kartikmankar.backend.entity.*;
import org.kartikmankar.backend.exception.UserException;
import org.kartikmankar.backend.repository.LeaveBalanceRepository;
import org.kartikmankar.backend.repository.LeaveRequestRepository;
import org.kartikmankar.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestServiceImp implements LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LeaveBalanceRepository balanceRepo;





    @Override
    public LeaveRequestDTO submitLeave(LeaveRequestDTO leaveRequestDTO) throws UserException {

        User user = userRepo.findById(leaveRequestDTO.getEmployeeID())
                .orElseThrow(() -> new UserException("Employee not found"));


        int days = (int) (leaveRequestDTO.getEndDate().toEpochDay() - leaveRequestDTO.getStartDate().toEpochDay()) + 1;
        if (days <= 0) {
            throw new UserException("End date must be after or same as start date");
        }


        LeaveBalance balance = balanceRepo.findByEmployeeId(user.getId())
                .orElseThrow(() -> new UserException("Leave balance not found"));


        LeaveType type = leaveRequestDTO.getLeaveType();
        int remainingDays = switch (type) {
            case SICK -> balance.getRemainingSickLeaves();
            case VACATION -> balance.getRemainingVacationLeaves();
            case OTHER -> balance.getOtherLeavesRemaining();
        };

        if (days > remainingDays) {
            throw new UserException("Insufficient " + type + " leaves. Only " + remainingDays + " days left.");
        }


        LeaveRequest request = LeaveRequest.builder()
                .employee(user)
                .leaveType(type)
                .startDate(leaveRequestDTO.getStartDate())
                .endDate(leaveRequestDTO.getEndDate())
                .reason(leaveRequestDTO.getReason())
                .status(LeaveStatus.PENDING)
                .managerComment(leaveRequestDTO.getManagerComment())
                .build();

        request = leaveRepo.save(request);


        return LeaveRequestDTO.builder()
                .id(request.getId())
                .employeeID(user.getId())
                .leaveType(type)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(request.getStatus())
                .managerComment(request.getManagerComment())
                .build();
    }


    @Override
    public List<LeaveRequestDTO> getLeavesByUserId(Long userId) throws UserException {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));

        List<LeaveRequest> leaves = leaveRepo.findByEmployeeId(userId);

        return leaves.stream().map(leave -> LeaveRequestDTO.builder()
                        .id(leave.getId())
                        .employeeID(user.getId())
                        .leaveType(leave.getLeaveType())
                        .startDate(leave.getStartDate())
                        .endDate(leave.getEndDate())
                        .reason(leave.getReason())
                        .status(leave.getStatus())
                        .managerComment(leave.getManagerComment())
                        .build())
                .toList();
    }


    @Override
    public LeaveRequestDTO updateLeaveStatus(Long leaveId, String status, String comment) throws UserException {
        LeaveRequest leave = leaveRepo.findById(leaveId)
                .orElseThrow(() -> new UserException("Leave not found"));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new UserException("Leave already reviewed");
        }

        LeaveStatus updatedStatus = LeaveStatus.valueOf(status);
        leave.setStatus(updatedStatus);
        leave.setManagerComment(comment);

        if (updatedStatus == LeaveStatus.APPROVED) {
            LeaveBalance balance = balanceRepo.findByEmployeeId(leave.getEmployee().getId())
                    .orElseThrow(() -> new UserException("Leave balance not found"));

            int days = (int) (leave.getEndDate().toEpochDay() - leave.getStartDate().toEpochDay() + 1);
            switch (leave.getLeaveType()) {
                case SICK -> balance.setRemainingSickLeaves(balance.getRemainingSickLeaves() - days);
                case VACATION -> balance.setRemainingVacationLeaves(balance.getRemainingVacationLeaves() - days);
                case OTHER -> balance.setOtherLeavesRemaining(balance.getOtherLeavesRemaining() - days);
            }

            balanceRepo.save(balance);
        }

        leave = leaveRepo.save(leave);

        return LeaveRequestDTO.builder()
                .id(leave.getId())
                .employeeID(leave.getEmployee().getId())
                .leaveType(leave.getLeaveType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .managerComment(leave.getManagerComment())
                .build();
    }

    @Override
    public int countLeavesByStatus(Long userId, String status) {
        return leaveRepo.countByUserIdAndStatus(userId, status.toUpperCase());
    }

    @Override
    public int countAllPendingLeaves() {
        return leaveRepo.countAllPendingLeaves();
    }


    @Override
    public int countAllLeaveRequests() {
        return leaveRepo.countAllLeaveRequests();
    }

    @Override
    public List<LeaveRequestDTO> getAllLeaves() {
        List<LeaveRequest> leaves = leaveRepo.findAll();

        return leaves.stream().map(leave -> LeaveRequestDTO.builder()
                        .id(leave.getId())
                        .employeeID(leave.getEmployee().getId())
                        .employeeCode(leave.getEmployee().getEmpCode())
                        .employeeName(leave.getEmployee().getName() + " (" + leave.getEmployee().getEmpCode()+")")
                        .department(leave.getEmployee().getDepartment())
                        .leaveType(leave.getLeaveType())
                        .startDate(leave.getStartDate())
                        .endDate(leave.getEndDate())
                        .reason(leave.getReason())
                        .status(leave.getStatus())
                        .managerComment(leave.getManagerComment())
                        .build())
                .toList();
    }

    @Override
    public int countAllLeavesByStatus(String status) {
        return leaveRepo.countAllLeavesByStatus(LeaveStatus.valueOf(status.toUpperCase()));
    }


    @Override
    public LeaveSummaryDTO getLeaveSummaryForUser(Long userId) throws UserException {
        LeaveBalance balance = balanceRepo.findByEmployeeId(userId)
                .orElseThrow(() -> new UserException("Leave balance not found"));

        int sickApproved = leaveRepo.countApprovedLeaveDaysByType(userId, LeaveType.SICK);
        int vacationApproved = leaveRepo.countApprovedLeaveDaysByType(userId,  LeaveType.VACATION);
        int otherApproved = leaveRepo.countApprovedLeaveDaysByType(userId, LeaveType.OTHER);


        int totalApproved = sickApproved + vacationApproved + otherApproved;
        int totalAllotted = balance.getTotalSickLeaves() + balance.getTotalVacationLeaves() + balance.getTotalOtherLeaves();
        int totalRemaining = totalAllotted - totalApproved;


        int approvedCount = leaveRepo.countByEmployeeIdAndStatus(userId, LeaveStatus.APPROVED);
        int rejectedCount = leaveRepo.countByEmployeeIdAndStatus(userId, LeaveStatus.REJECTED);
        int pendingCount = leaveRepo.countByEmployeeIdAndStatus(userId, LeaveStatus.PENDING);


        return LeaveSummaryDTO.builder()
                .totalSick(balance.getTotalSickLeaves())
                .approvedSick(sickApproved)
                .totalVacation(balance.getTotalVacationLeaves())
                .approvedVacation(vacationApproved)
                .totalOther(balance.getTotalOtherLeaves())
                .approvedOther(otherApproved)
                .totalApproved(totalApproved)
                .totalAllotted(totalAllotted)
                .totalRemaining(totalRemaining)


                .approvedCount(approvedCount)
                .rejectedCount(rejectedCount)
                .pendingCount(pendingCount)

                .build();
    }








}
