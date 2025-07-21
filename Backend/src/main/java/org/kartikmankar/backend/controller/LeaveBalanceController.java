package org.kartikmankar.backend.controller;

import org.kartikmankar.backend.entity.LeaveBalance;
import org.kartikmankar.backend.exception.UserException;
import org.kartikmankar.backend.service.LeaveBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leaves")
public class LeaveBalanceController {

    @Autowired
    private LeaveBalanceService leaveBalanceService;

    @GetMapping("/balance/{userId}")
    public ResponseEntity<LeaveBalance> getLeaveBalance(@PathVariable Long userId) throws UserException {
        LeaveBalance balance = leaveBalanceService.getLeaveBalance(userId);
        return ResponseEntity.ok(balance);
    }
}
