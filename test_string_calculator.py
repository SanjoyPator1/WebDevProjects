import unittest
from string_calculator import StringCalculator

class TestStringCalculator(unittest.TestCase):
    def setUp(self):
        self.calculator = StringCalculator()
        
    def test_empty_string_returns_zero(self):
        self.assertEqual(0, self.calculator.add(""))

    def test_single_number_returns_value(self):
        self.assertEqual(1, self.calculator.add("1"))

    def test_two_numbers_returns_sum(self):
        self.assertEqual(6, self.calculator.add("1,5"))

    def test_multiple_numbers_returns_sum(self):
        self.assertEqual(15, self.calculator.add("1,2,3,4,5"))

    def test_newline_as_delimiter(self):
        self.assertEqual(6, self.calculator.add("1\n2,3"))

    def test_custom_delimiter(self):
        self.assertEqual(3, self.calculator.add("//;\n1;2"))

    def test_negative_number_throws_exception(self):
        with self.assertRaises(ValueError) as context:
            self.calculator.add("1,-2")
        self.assertEqual("negative numbers not allowed -2", str(context.exception))

    def test_multiple_negative_numbers_throws_exception(self):
        with self.assertRaises(ValueError) as context:
            self.calculator.add("1,-2,-3,4,-5")
        self.assertEqual("negative numbers not allowed -2,-3,-5", str(context.exception))

if __name__ == "__main__":
    unittest.main()