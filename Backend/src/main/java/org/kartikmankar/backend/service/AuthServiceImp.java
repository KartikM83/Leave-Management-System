package org.kartikmankar.backend.service;

import org.kartikmankar.backend.DTO.ChangePasswordDTO;
import org.kartikmankar.backend.DTO.UserDTO;
import org.kartikmankar.backend.entity.User;
import org.kartikmankar.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.kartikmankar.backend.repository.UserRepository;

import java.util.Optional;

@Service
public class AuthServiceImp implements AuthService{


    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LeaveBalanceService leaveBalanceService;




    @Override
    public UserDTO register(UserDTO userDTO) throws UserException {
        Optional<User> optional = userRepo.findByEmail(userDTO.getEmail());
        if (optional.isPresent()) throw new UserException("USER_FOUND");

        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));


        String nextEmpCode = "";
        if (userDTO.getRole().name().equals("EMPLOYEE")) {
            String lastEmp = userRepo.findLastEmployeeCode();  // e.g., "EMP005"
            int nextNum = (lastEmp != null && lastEmp.length() >= 6)
                    ? Integer.parseInt(lastEmp.substring(3)) + 1
                    : 1;
            nextEmpCode = String.format("EMP%03d", nextNum);
        } else if (userDTO.getRole().name().equals("MANAGER")) {
            String lastManager = userRepo.findLastManagerCode();  // e.g., "M002"
            int nextNum = (lastManager != null && lastManager.length() >= 4)
                    ? Integer.parseInt(lastManager.substring(1)) + 1
                    : 1;
            nextEmpCode = String.format("M%03d", nextNum);
        }

        User user = User.builder()
                .empCode(nextEmpCode)
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .role(userDTO.getRole())
                .build();

        user = userRepo.save(user);



        // Initialize leave balance for EMPLOYEES
        if (user.getRole().name().equals("EMPLOYEE")) {
            leaveBalanceService.initializeLeaveBalance(user.getId());
        }

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .empCode(user.getEmpCode())
                .build();
    }



    @Override
    public UserDTO login(UserDTO userDTO) {
        Optional<User> optionalUser = userRepo.findByEmail(userDTO.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();


            if (passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
                return UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .password(user.getPassword())
                        .role(user.getRole())
                        .build();
            } else {
                throw new RuntimeException("Invalid Password");
            }
        } else {
            throw new RuntimeException("User not found with email: " + userDTO.getEmail());
        }
    }



    @Override
    public UserDTO updateProfile(Long id, UserDTO dto) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmpCode(dto.getEmpCode());
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setGender(dto.getGender());
        user.setDob(dto.getDob());
        user.setMobile(dto.getMobile());
        user.setAddress(dto.getAddress());
        user.setCity(dto.getCity());
        user.setCountry(dto.getCountry());
        user.setDepartment(dto.getDepartment());

        user = userRepo.save(user);

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .empCode(user.getEmpCode())
                .lastName(user.getLastName())
                .gender(user.getGender())
                .dob(user.getDob())
                .mobile(user.getMobile())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .department(user.getDepartment())
                .build();
    }

    @Override
    public UserDTO getProfile(Long id) throws UserException {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserException("User not found"));

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .empCode(user.getEmpCode())
                .gender(user.getGender())
                .dob(user.getDob())
                .mobile(user.getMobile())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .department(user.getDepartment())
                .build();
    }



    @Override
    public void changePassword(Long id, ChangePasswordDTO dto) throws UserException {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserException("User not found"));

        // Check old password match
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new UserException("Old password is incorrect");
        }

        // Encode and update new password
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }



}
