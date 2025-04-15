class StringCalculator:
    """A simple string calculator that adds numbers from a string."""
    
    def add(self, numbers):
        """
        Add numbers provided as a string.
        
        Args:
            numbers: A string containing numbers separated by commas
        
        Returns:
            The sum of the numbers in the string
        """
        if not numbers:
            return 0
        
        nums = numbers.split(",")
        return sum(int(num) for num in nums)