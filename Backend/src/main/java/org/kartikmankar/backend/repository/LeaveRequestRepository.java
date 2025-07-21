    package org.kartikmankar.backend.repository;

    import org.kartikmankar.backend.entity.LeaveRequest;
    import org.kartikmankar.backend.entity.LeaveStatus;
    import org.kartikmankar.backend.entity.LeaveType;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long> {
        List<LeaveRequest> findByEmployeeId(Long userId);

        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.employee.id = :userId AND l.status = :status")
        int countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.status = 'PENDING'")
        int countAllPendingLeaves();


        @Query("SELECT COUNT(l) FROM LeaveRequest l")
        int countAllLeaveRequests();

        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.status = :status")
        int countAllLeavesByStatus(@Param("status") LeaveStatus status);





        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.employee.id = :userId AND l.status = :status")
        int countByEmployeeIdAndStatus(@Param("userId") Long userId, @Param("status") LeaveStatus status);

        @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.employee.id = :userId AND l.leaveType = :type AND l.status = 'APPROVED'")
        int countApprovedLeavesByType(@Param("userId") Long userId, @Param("type") LeaveType type);



    }
