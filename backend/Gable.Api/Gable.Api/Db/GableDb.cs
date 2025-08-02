namespace Gable.Api.Db;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class GableDb : DbContext
{
    public GableDb(DbContextOptions<GableDb> options) : base(options) { }
    
}