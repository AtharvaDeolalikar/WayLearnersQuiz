import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { Component } from "react";

export default class Temp extends Component {
  constructor() {
    super();
    this.state = {
      form: true,
      alert: false,
    };
  }


  onChangeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("Captcha Resolved");
          this.onSignInSubmit();
        },
        defaultCountry: "IN",
      }
    );
  };

  onSignInSubmit = (e) => {
    e.preventDefault();
    this.setUpRecaptcha();
    let phoneNumber = "+91" + this.state.mobile;
    console.log(phoneNumber);
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // console.log(confirmationResult);
        console.log("OTP is sent");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onSubmitOtp = (e) => {
    e.preventDefault();
    let otpInput = this.state.otp;
    let optConfirm = window.confirmationResult;
    // console.log(codee);
    optConfirm
      .confirm(otpInput)
      .then(function (result) {
        // User signed in successfully.
        // console.log("Result" + result.verificationID);
        let user = result.user;
      })
      .catch(function (error) {
        console.log(error);
        alert("Incorrect OTP");
      });
  };

  render() {
    return (
      <div>
        <div fluid="sm" className="mt-3">
          <div className="justify-content-center">
            <div xs={12} md={6} lg={5}>
              <h2 className="mb-3">Login</h2>
              <form className="form" onSubmit={this.onSignInSubmit}>
                <div id="recaptcha-container"></div>
                <div>
                  <input
                    type="number"
                    name="mobile"
                    placeholder="Mobile Number"
                    onChange={this.onChangeHandler}
                    required
                  />
                </div>
                <button button="Submit" type="submit" >Submit</button>
              </form>
            </div>
          </div>
          <div className="justify-content-center">
            <div xs={12} md={6} lg={5}>
              <h2 className="mb-3">Enter OTP</h2>
              <form className="form" onSubmit={this.onSubmitOtp}>
                <div>
                  <input
                    id="otp"
                    type="number"
                    name="otp"
                    placeholder="OTP"
                    onChange={this.onChangeHandler}
                  />
                </div>
                <button button="Submit" type="submit" >Verify</button>
              </form>
            </div>
          </div>
      </div>
      </div>
    );
  }
}
