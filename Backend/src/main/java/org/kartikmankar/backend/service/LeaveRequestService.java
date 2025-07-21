package org.kartikmankar.backend.service;

import org.kartikmankar.backend.DTO.LeaveRequestDTO;
import org.kartikmankar.backend.DTO.LeaveSummaryDTO;
import org.kartikmankar.backend.exception.UserException;

import java.util.List;

public interface LeaveRequestService {

    public LeaveRequestDTO submitLeave(LeaveRequestDTO leaveRequestDTO) throws UserException;

    List<LeaveRequestDTO> getLeavesByUserId(Long userId) throws UserException;

    LeaveRequestDTO updateLeaveStatus(Long leaveId, String status, String comment) throws UserException;

    int countLeavesByStatus(Long userId, String status);

    int countAllPendingLeaves();

    int countAllLeaveRequests();

    List<LeaveRequestDTO> getAllLeaves();

    int countAllLeavesByStatus(String status);

    public LeaveSummaryDTO getLeaveSummaryForUser(Long userId) throws UserException;
}
