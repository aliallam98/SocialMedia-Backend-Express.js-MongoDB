
export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
    pagination = (model) => {
    let page = this.queryData.page;
    let size = this.queryData.size;
    if (page <= 0 || !page) page = 1;
    if (size <= 0 || !size) size = 5;
    let skip = size * (page - 1);
    this.mongooseQuery.skip(skip).limit(size);
    

    model.countDocuments().then((value)=>{
      this.queryData.totalCount = value
      this.queryData.totalPages = Math.ceil(this.queryData.totalCount / size)
      if(this.queryData.totalPages > page )  this.queryData.next = (Number(page) +1)
      if(page > 1) this.queryData.previous = (Number(page) - 1)
      this.queryData.currentPage = Number(page)
      this.queryData.resultsPerPage = Number(size)

    })

    return this;
  };
  filter = () => {
    const exculdedFilterData = ["sort", "page", "size", "fields", "searchKey"];
    let queryCopy = { ...this.queryData };
    exculdedFilterData.forEach((ele) => {
      delete queryCopy[ele];
    });
    queryCopy = JSON.parse(
      JSON.stringify(queryCopy).replace(
        /lt|lte|gt|gte/g,
        (match) => `$${match}`
      )
    );
    console.log(queryCopy);
    this.mongooseQuery.find(queryCopy);
    return this;
  };

  sort = () => {
    if (this.queryData.sort) {
      this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, ' '));
    }
    return this
  };

  search = () => {
if(this.queryData.searchKey){
    this.mongooseQuery.find({
        $or: [
          { name: { $regex: `${this.queryData.searchKey}` } },
          { description: { $regex: `${this.queryData.searchKey}` } },
        ],
      });
}
return this;

  };

  select = () => {
    if(this.queryData.fields){
      this.mongooseQuery.select(this.queryData.fields.replace(/,/g, ' '));
    }
    return this;
  };


}
