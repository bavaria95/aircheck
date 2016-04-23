import os
import binascii
import datetime
import re

def generate_random_token():
	token_length = 36
	return binascii.hexlify(os.urandom(token_length))


def email_validator(email):
	return re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is not None