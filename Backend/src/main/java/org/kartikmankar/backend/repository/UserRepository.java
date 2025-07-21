package org.kartikmankar.backend.repository;

import org.kartikmankar.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u.empCode FROM User u WHERE u.role = 'EMPLOYEE' AND u.empCode IS NOT NULL ORDER BY u.id DESC LIMIT 1")
    String findLastEmployeeCode();

    @Query("SELECT u.empCode FROM User u WHERE u.role = 'MANAGER' AND u.empCode IS NOT NULL ORDER BY u.id DESC LIMIT 1")
    String findLastManagerCode();



}
