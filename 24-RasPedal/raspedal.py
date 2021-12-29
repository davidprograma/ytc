try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print("Error importing RPi.GPIO!")
    print("You need superuser privileges")
    print("Use 'sudo' to run your script")
    exit()

# important parameters

# max_speed_count: number of counts per second
# to reach maximum speed (100% duty cycle)
max_speed_count = 12

# speed_exponent: speed is calculated as a normalized value
# (between 0.1) and then it is pow'ed to some exponent.
# for example, when reaching half of the maximum count (0.5),
# if the exponent is 2, the resulting value would be
# 0.5 ^ 2 = 0.25 (25% duty cycle)
speed_exponent = 2.0

from time import sleep, time
from threading import Thread
from math import sqrt, pow

GPIO.setmode(GPIO.BOARD)

# setup input channel
input_channel = 7
GPIO.setup(input_channel, GPIO.IN)

# setup output channel
output_channel = 5
output_frequency = 8000
output_duty_cycle = 0.0   # 0.0 to 100.0

GPIO.setup(output_channel, GPIO.OUT)
pwm = GPIO.PWM(output_channel, output_frequency)
pwm.start(output_duty_cycle)

# prev and curr timestamps
prev_ts = None
curr_ts = None

# thread stop flag
stop_threads = False

# edge detection callback
def process_input_edge(channel):
    global curr_ts
    # mark detection timestamp
    curr_ts = time()

# setup edge detection
GPIO.add_event_detect(input_channel, GPIO.RISING, callback=process_input_edge)

# count number of detections in array
def count_array(arr):
    sum = 0
    for i in range(len(arr)):
        if arr[i] != 0:
            sum += 1
    return sum


# counter for avoiding too frequent log
log_count = 0

def log_data(count, dutycycle):
    global log_count
    log_count += 1
    # only log every 10 calls
    if log_count < 10: return
    log_count = 0
    print
    print("reed count: {} per second".format(count))
    print("duty cycle: {} %".format(int(dutycycle)))

def output_thread_proc():
    global max_speed_count
    global speed_exponent
    global stop_threads
    global curr_ts
    global prev_ts
    global pwm

    period = 0.01
    index = 0
    arrlen = 100
    array = []

    limit = float(max_speed_count)
    value = 0.0

    k = 0.9

    for i in range(arrlen):
        array.append(0)

    while not stop_threads:
        if curr_ts == None:
            sleep(period)
            continue
        if prev_ts == None:
            prev_ts = curr_ts
            sleep(period)
            continue
        if curr_ts != prev_ts:
            delta = curr_ts - prev_ts
            prev_ts = curr_ts
            array[index] = 1
        else:
            array[index] = 0
        index += 1
        if index >= arrlen:
            index = 0

        count = count_array(array)
        if count > limit:
            count = limit

        value = (1-k) * value + k * (count / limit)
        # print("value = {}".format(value))

        value2 = pow(value, speed_exponent)
        # print("value2 = {}".format(value2))

        duty_cycle = value2 * 100.0
        if duty_cycle < 0.0:
            duty_cycle = 0.0
        if duty_cycle > 100.0:
            duty_cycle = 100.0

        #print("duty_cycle = {}".format(duty_cycle))
        pwm.ChangeDutyCycle(duty_cycle)

        log_data(count, duty_cycle)

        sleep(period)

    print("Exiting output thread");

output_thread = Thread(target = output_thread_proc)
output_thread.start()

try:
    while True:
        sleep(0.1)
except KeyboardInterrupt:
    pass

print()
print("interrupted, cleaning up")

GPIO.remove_event_detect(input_channel)

stop_threads = True

output_thread.join()

pwm.stop()

GPIO.cleanup()

print("exiting...")
import sys
sys.exit()
