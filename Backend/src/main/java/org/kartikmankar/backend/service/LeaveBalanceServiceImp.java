package org.kartikmankar.backend.service;

import org.kartikmankar.backend.entity.LeaveBalance;
import org.kartikmankar.backend.entity.User;
import org.kartikmankar.backend.exception.UserException;
import org.kartikmankar.backend.repository.LeaveBalanceRepository;
import org.kartikmankar.backend.repository.LeaveRequestRepository;
import org.kartikmankar.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeaveBalanceServiceImp implements LeaveBalanceService {

    @Autowired
    private LeaveBalanceRepository balanceRepo;



    @Autowired
    private UserRepository userRepo;

    @Override
    public LeaveBalance getLeaveBalance(Long userId) throws UserException {
        return balanceRepo.findByEmployeeId(userId)
                .orElseThrow(() -> new UserException("Leave balance not found"));
    }

    @Override
    public void initializeLeaveBalance(Long userId) throws UserException {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));


        if (balanceRepo.findByEmployeeId(userId).isPresent()) return;

        LeaveBalance balance = LeaveBalance.builder()
                .employee(user)
                .totalSickLeaves(10)
                .totalVacationLeaves(10)
                .totalOtherLeaves(5)
                .remainingSickLeaves(10)
                .remainingVacationLeaves(10)
                .otherLeavesRemaining(5)
                .build();

        balanceRepo.save(balance);
    }









}
