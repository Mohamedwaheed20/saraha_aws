import Joi from "joi";

const agevalue=(value,helpers)=>{
    if(value<18){
       
        return helpers.error("any.invalid");
    }
    return value
}
export const signupschema = Joi.object({
    body: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email({
            tlds:
        {
        allow: ['com', 'net', 'org']
        },
        // minDomainSegments: 2,
        maxDomainSegments: 2
        }),
        password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/),
        phonenumber: Joi.string().required(),
        age: Joi.number().required().custom(agevalue),
       
    }),
});