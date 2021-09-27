#!/bin/python
import os

srcfn = 'emptyadf'
dstpath = '..'
dstext = '.ADF'
cmd = 'copy' # use copy for windows, cp for unix

first = 0
last = 199

for i in range(first,last+1):
    dstfn = str(i).zfill(3)
    fullcmd = cmd + ' ' + srcfn + ' ' + os.path.join(dstpath, dstfn + dstext)
    print(fullcmd)
    os.system(fullcmd)

