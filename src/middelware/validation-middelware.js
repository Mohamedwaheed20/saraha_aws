

export const validationmidellware = (schema) => {
    return (req, res, next) => {
        const shemakeys = Object.keys(schema);
        let valisationerror=[]
        for(const key of shemakeys){
        const { error } = schema.validate({ body: req.body }, { abortEarly: false });

        if (error) {
            valisationerror.push(...error.details)
        }
    }
if(valisationerror.length>0){
    return res.status(400).json({
        message: "Validation failed",
        errors: valisationerror,
    });
}
        next();
    };
};