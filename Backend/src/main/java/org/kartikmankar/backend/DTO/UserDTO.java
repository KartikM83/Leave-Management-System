package org.kartikmankar.backend.DTO;

import org.kartikmankar.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotBlank(message = "{user.name.absent}")
    private String name;

    @NotBlank(message = "{user.email.absent}")
    @Email(message = "{user.email.invalid}")
    private String email;

    @NotBlank(message = "{user.password.absent}")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@#$^&+=!]).{8,15}$",message = "{user.password.invalid}")
    private String password;

//    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;



    private Role role;



    private String empCode;
    private String lastName;
    private String gender;
    private String dob;
    private String mobile;
    private String address;
    private String city;
    private String country;
    private String department;




}
