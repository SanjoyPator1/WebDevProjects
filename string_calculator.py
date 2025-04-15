class StringCalculator:
    """A simple string calculator that adds numbers from a string."""
    
    def add(self, numbers):
        """
        Add numbers provided as a string.
        
        Args:
            numbers: A string containing numbers separated by delimiters
                    (comma by default, or custom delimiter specified at the beginning)
        
        Returns:
            The sum of the numbers in the string
        """
        if not numbers:
            return 0
        
        delimiter = ","
        if numbers.startswith("//"):
            delimiter_line, numbers = numbers.split("\n", 1)
            delimiter = delimiter_line[2:]
        
        numbers = numbers.replace("\n", delimiter)
        nums = numbers.split(delimiter)

        negative_nums = [int(num) for num in nums if int(num) < 0]
        if negative_nums:
            negative_str = ",".join(str(num) for num in negative_nums)
            raise ValueError(f"negative numbers not allowed {negative_str}")

        return sum(int(num) for num in nums)