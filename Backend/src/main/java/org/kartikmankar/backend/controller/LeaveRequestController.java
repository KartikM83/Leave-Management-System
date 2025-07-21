package org.kartikmankar.backend.controller;

import jakarta.validation.Valid;
import org.kartikmankar.backend.DTO.LeaveRequestDTO;
import org.kartikmankar.backend.DTO.LeaveSummaryDTO;
import org.kartikmankar.backend.exception.UserException;
import org.kartikmankar.backend.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequestDTO> applyLeave(@RequestBody @Valid LeaveRequestDTO leaveRequestDTO)
            throws UserException {

        LeaveRequestDTO saved = leaveRequestService.submitLeave(leaveRequestDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/leaves/{userId}")
    public ResponseEntity<List<LeaveRequestDTO>> getLeavesByUserId(@PathVariable Long userId) throws UserException {
        List<LeaveRequestDTO> leaveList = leaveRequestService.getLeavesByUserId(userId);
        return new ResponseEntity<>(leaveList, HttpStatus.OK);
    }

    @PutMapping("/leaves/{leaveId}/review")
    public ResponseEntity<LeaveRequestDTO> reviewLeave(
            @PathVariable Long leaveId,
            @RequestParam String status,
            @RequestParam String comment) throws UserException {
        LeaveRequestDTO updated = leaveRequestService.updateLeaveStatus(leaveId, status.toUpperCase(), comment);
        return ResponseEntity.ok(updated);
    }


    @GetMapping("/{userId}/count/{status}")
    public ResponseEntity<Integer> getLeaveCountByStatus(@PathVariable Long userId, @PathVariable String status) {
        int count = leaveRequestService.countLeavesByStatus(userId, status);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/manager/pending-count")
    public ResponseEntity<Integer> getAllPendingLeavesCount() {
        int count = leaveRequestService.countAllPendingLeaves();
        return ResponseEntity.ok(count);
    }

    // LeaveRequestController.java
    @GetMapping("/manager/total-count")
    public ResponseEntity<Integer> getAllLeaveRequestsCount() {
        int count = leaveRequestService.countAllLeaveRequests();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/manager/all-leaves")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaveRequests() {
        List<LeaveRequestDTO> leaveList = leaveRequestService.getAllLeaves();
        return new ResponseEntity<>(leaveList, HttpStatus.OK);
    }

    @GetMapping("/manager/status-count")
    public ResponseEntity<Integer> getLeaveCountByStatus(@RequestParam String status) {
        int count = leaveRequestService.countAllLeavesByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{userId}/summary")
    public ResponseEntity<LeaveSummaryDTO> getLeaveSummary(@PathVariable Long userId) throws UserException {
        LeaveSummaryDTO summary = leaveRequestService.getLeaveSummaryForUser(userId);
        return ResponseEntity.ok(summary);
    }





}
