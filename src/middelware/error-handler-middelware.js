export const errorHandler = (api) => {
    return (req, res, next) => {
      api(req, res, next).catch((error) => {
        console.log(`Error in ${req.url} from errorHandler middleware`, error);
        return next(new Error(error.message, { cause: 500 }));
      });
    };
  };
  
  export const globalErrorHandler = (error, req, res, next) => {
    console.log('Global error handler:', error.message);
    return   res.status(500).json({ message: 'Something went wrong', error:error.message });
  };