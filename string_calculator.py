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
            
        Raises:
            ValueError: If the string contains negative numbers
        """
        if not numbers:
            return 0
        
        delimiter, numbers_to_process = self._extract_delimiter_and_numbers(numbers)
        
        nums = self._parse_numbers(numbers_to_process, delimiter)
        
        self._check_for_negative_numbers(nums)
        
        return sum(nums)
    
    def _extract_delimiter_and_numbers(self, numbers):
        """Extract custom delimiter if present and return both delimiter and numbers."""
        delimiter = ","
        numbers_to_process = numbers
        
        if numbers.startswith("//"):
            delimiter_line, numbers_to_process = numbers.split("\n", 1)
            delimiter = delimiter_line[2:]
            
        return delimiter, numbers_to_process
    
    def _parse_numbers(self, numbers_str, delimiter):
        """Parse numbers from string using the delimiter."""
        numbers_str = numbers_str.replace("\n", delimiter)
        return [int(num) for num in numbers_str.split(delimiter) if num]
    
    def _check_for_negative_numbers(self, numbers):
        """Check for negative numbers and raise exception if found."""
        negative_nums = [num for num in numbers if num < 0]
        if negative_nums:
            negative_str = ",".join(str(num) for num in negative_nums)
            raise ValueError(f"negative numbers not allowed {negative_str}")