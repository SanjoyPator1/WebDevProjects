class StringCalculator:
    """A simple string calculator that adds numbers from a string."""
    
    def add(self, numbers):
        """
        Add numbers provided as a string.
        
        Args:
            numbers: A string containing numbers separated by commas or newlines
        
        Returns:
            The sum of the numbers in the string
        """
        if not numbers:
            return 0
        
        numbers = numbers.replace("\n", ",")
        nums = numbers.split(",")
        return sum(int(num) for num in nums)