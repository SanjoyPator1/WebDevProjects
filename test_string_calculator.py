import unittest
from string_calculator import StringCalculator

class TestStringCalculator(unittest.TestCase):
    def setUp(self):
        self.calculator = StringCalculator()
        
    def test_empty_string_returns_zero(self):
        self.assertEqual(0, self.calculator.add(""))

if __name__ == "__main__":
    unittest.main()