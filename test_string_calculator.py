import unittest
from string_calculator import StringCalculator

class TestStringCalculator(unittest.TestCase):
    """Test cases for the StringCalculator class."""
    
    def setUp(self):
        """Set up a new calculator instance before each test."""
        self.calculator = StringCalculator()
        
    def test_empty_string_returns_zero(self):
        """Test that an empty string returns 0."""
        self.assertEqual(0, self.calculator.add(""))
        
    def test_single_number_returns_value(self):
        """Test that a single number returns its value."""
        self.assertEqual(1, self.calculator.add("1"))
        
    def test_two_numbers_returns_sum(self):
        """Test that two numbers return their sum."""
        self.assertEqual(6, self.calculator.add("1,5"))
        
    def test_multiple_numbers_returns_sum(self):
        """Test that multiple numbers return their sum."""
        self.assertEqual(15, self.calculator.add("1,2,3,4,5"))
        
    def test_newline_as_delimiter(self):
        """Test that newlines can be used as delimiters."""
        self.assertEqual(6, self.calculator.add("1\n2,3"))
        
    def test_custom_delimiter(self):
        """Test that custom delimiters can be specified."""
        self.assertEqual(3, self.calculator.add("//;\n1;2"))
        
    def test_negative_number_throws_exception(self):
        """Test that negative numbers throw an exception."""
        with self.assertRaises(ValueError) as context:
            self.calculator.add("1,-2")
        self.assertEqual("negative numbers not allowed -2", str(context.exception))
        
    def test_multiple_negative_numbers_throws_exception(self):
        """Test that multiple negative numbers are all reported in the exception."""
        with self.assertRaises(ValueError) as context:
            self.calculator.add("1,-2,-3,4,-5")
        self.assertEqual("negative numbers not allowed -2,-3,-5", str(context.exception))

if __name__ == "__main__":
    unittest.main()