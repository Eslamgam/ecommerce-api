class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }


    filter() {
        const queryStringObj = { ...this.queryString }
        const listOfExcloudedWord = ["page", "limit", "sort", "fields"]
        listOfExcloudedWord.forEach((word) => delete queryStringObj[word])
        console.log(this.queryString);
        console.log(queryStringObj);
        let querySting = JSON.stringify(queryStringObj)
        querySting = querySting.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`)
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querySting))
        return this
    }


    sort() {
        if (this.queryString.sort) {
            console.log(this.queryString.sort);
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy);
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("createdAt")
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            console.log(fields);
            this.mongooseQuery = this.mongooseQuery.select(fields)

        }
        return this

    }

    search(modelName) {
        if (this.queryString.keyword) {
            

            if(modelName == 'Product'){
                this.mongooseQuery = this.mongooseQuery.find({
                    $or: [{ title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }]
                })
            }else{
                this.mongooseQuery = this.mongooseQuery.find({name: { $regex: this.queryString.keyword, $options: 'i' } })
            }
        }
        return this
    }

    paginate(countDocuments) {
        const limit = this.queryString.limit || 20;
        const page = this.queryString.page || 1;
        const skip = (page - 1) * limit;

        const endIndex = page * limit


        const pagination = {}

        pagination.currentPage = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(countDocuments / limit)

        if (endIndex < countDocuments) {
            pagination.next = page + 1

        }
        if (skip > 0) {
            pagination.prev = page - 1
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        this.paginationResult = pagination
        return this
    }
}



module.exports = ApiFeatures