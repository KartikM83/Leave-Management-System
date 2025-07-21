package org.kartikmankar.backend.service;

import org.kartikmankar.backend.entity.LeaveBalance;
import org.kartikmankar.backend.exception.UserException;

public interface LeaveBalanceService {
    LeaveBalance getLeaveBalance(Long userId) throws UserException;

    void initializeLeaveBalance(Long userId) throws UserException;  // when registering


}
