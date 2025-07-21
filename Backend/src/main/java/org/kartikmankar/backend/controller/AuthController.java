package org.kartikmankar.backend.controller;

import jakarta.validation.Valid;
import org.kartikmankar.backend.DTO.ChangePasswordDTO;
import org.kartikmankar.backend.DTO.UserDTO;
import org.kartikmankar.backend.entity.User;
import org.kartikmankar.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.kartikmankar.backend.service.AuthService;

@RestController
@RequestMapping("/users")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserDTO userDTO) throws UserException {
        userDTO = authService.register(userDTO);
        return new ResponseEntity<>(userDTO,HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO loginDTO)  throws UserException{

        UserDTO user =authService.login(loginDTO);
        return ResponseEntity.ok(user);

    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable Long id, @RequestBody UserDTO dto) throws UserException {
        UserDTO updated = authService.updateProfile(id, dto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserDTO> getProfile(@PathVariable Long id) throws UserException {
        UserDTO dto = authService.getProfile(id);
        return ResponseEntity.ok(dto);
    }



    @PutMapping("/change-password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody ChangePasswordDTO dto) throws UserException {
        authService.changePassword(id, dto);
        return ResponseEntity.ok("Password updated successfully!");
    }






}
