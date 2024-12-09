export const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
  
    return new Date(date).toLocaleDateString("id-ID", options);
  };
  
  export const formatTime = (time: string): string => {
    if (time) {
      const timeSplitted = time.split(":");
      const hours = timeSplitted[0];
      const minutes = timeSplitted[1];
      return `${hours}:${minutes}`;
    } else {
      return "";
    }
  };
  