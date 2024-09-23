#!/usr/bin/env python3

import os
import subprocess
import shutil
import signal
import time

# Set absolute paths
current_dir = os.getcwd()  # Get the current working directory
src_path = os.path.join(current_dir, "backend/build/contracts/")
dst_path = os.path.join(current_dir, "frontend/src/contracts/")

files_to_copy = ["DeedRepository", "AuctionRepository"]

# Function to run shell commands and handle errors
def run_command(command, cwd=None):
    try:
        subprocess.run(command, shell=True, cwd=cwd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        exit(1)

# Function to stop IPFS daemon
def cleanup():
    if ipfs_proc:
        print("Stopping IPFS daemon...")
        ipfs_proc.terminate()
        ipfs_proc.wait()

# Initialize IPFS if not already initialized
print("Checking if IPFS is initialized...")
if not os.path.exists(os.path.expanduser("~/.ipfs")):
    print("Initializing IPFS...")
    run_command('ipfs init')

# Start IPFS daemon in the background
print("Starting IPFS daemon...")
ipfs_proc = subprocess.Popen(['ipfs', 'daemon'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(5)  # Wait a few seconds for the IPFS daemon to initialize

# Change to backend folder and compile truffle contracts
print("Changing to backend folder and compiling truffle contracts...")
if not os.path.exists('backend'):
    print("Error: backend folder not found")
    exit(1)

# Compile truffle contracts in the backend folder
run_command('truffle compile', cwd='backend')

# Migrate truffle contracts to ganache network
print("Migrating truffle contracts to ganache network...")
run_command('truffle migrate --network ganache', cwd='backend')

# Change back to the main directory after working in backend
print("Returning to the main directory...")
os.chdir(current_dir)

# Ensure the destination directory exists
print("Ensuring the destination directory exists...")
os.makedirs(dst_path, exist_ok=True)

# Copy files from build/contracts to frontend/src/contracts and overwrite if necessary
print("Copying files to frontend/src/contracts (overwriting if necessary)...")
for file in files_to_copy:
    src_file = f"{src_path}{file}.json"
    dst_file = f"{dst_path}{file}.json"
    
    if os.path.isfile(src_file):
      shutil.copy2(src_file, dst_file)
      print(f"Copied {src_file} to {dst_file}")
    else:
      print(f"Error: {src_file} not found")
      exit(1)

# Change to frontend folder and run npm run dev
print("Running npm run dev in frontend folder...")
run_command('npm run dev', cwd='frontend')
