package org.kartikmankar.backend.service;

import jakarta.validation.Valid;
import org.kartikmankar.backend.DTO.ChangePasswordDTO;
import org.kartikmankar.backend.DTO.UserDTO;
import org.kartikmankar.backend.exception.UserException;

public interface AuthService {

    public UserDTO register(UserDTO userDTO) throws UserException;

    public UserDTO login(UserDTO userDTO) throws UserException;

    UserDTO updateProfile(Long id, UserDTO dto) throws  UserException;

    UserDTO getProfile(Long id) throws UserException;

    void changePassword(Long id, ChangePasswordDTO dto) throws UserException;

}
