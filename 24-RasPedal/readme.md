RasPedal - Python scripts for playing GTA with a pedalier and a modified gamepad
================================================================================

See [project video in YouTube](https://youtu.be/jm95aeSz9Fg).

These are script for a setup intended to play GTA (or any game played on a PC with a game controller using an analog trigger for controlling vehicle acceleration) using a pedalier (or a static bicycle).

A raspberry pi will read the pedalier inputs using a reed relay, and will inject the adequate analog signal into a modified game controller (using some auxilliary electronic components).

These python scripts will do the trick.

- raspedal.py: main script.
- input_reed.py: input test for reading from reed relay (debouncer recommended).
- output_pwm.py: output test for generating PWM.
