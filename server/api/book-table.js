import axios from 'axios';

const handleSubmit = async e => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await axios.post(
      'http://localhost:3000/api/book-table',
      formData,
    );

    if (response.data.success) {
      setSubmitted(true);
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    alert('Something went wrong. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};
