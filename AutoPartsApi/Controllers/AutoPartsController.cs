using AutoPartsApi.DTOs;
using AutoPartsApi.Models;
using AutoPartsApi.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Route("auto-parts")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class AutoPartController : ControllerBase {
    private readonly AppDbContext _appDbContext;
    public AutoPartController(AppDbContext appDbContext, ProblemDetailsFactory problemDetailsFactory){
        _appDbContext = appDbContext;
    }

    [HttpGet()]
    [Route("all")]
    public async Task<IEnumerable<AutoPart>> GetAll(){
        return await _appDbContext.AutoParts.Select(x => x).ToArrayAsync();
    }

    [HttpGet()]
    [Route("{page:int}")]
    public async Task<IEnumerable<AutoPart>> GetPage(int page){
        int contentCount = 100;
        return await _appDbContext.AutoParts
            .Select(ap => ap)
            .Skip(page * contentCount - contentCount)
            .Take(contentCount)
            .ToArrayAsync();
    }

    [HttpPost()]
    [Route("create")]
    public async Task<IActionResult> Create([FromBody] AutoPart autoPart){
        await _appDbContext.AutoParts.AddAsync(autoPart);
        await _appDbContext.SaveChangesAsync();
        return Ok(autoPart);
    }

    [HttpPost()]
    [Route("sell")]
    [TypeFilter(typeof(OrderSummaryValidationAttribute))]
    public async Task<IActionResult> Sell([FromBody]OrderSummaryModel orderSummary){
        Order order = new Order(){
            TotalPriceInKzt = orderSummary.TotalPriceInKzt,
            AutoPartsSoldAmounts = new List<AutoPartSoldAmount>()
        };
        foreach(AutoPart autoPart in orderSummary.OrderedParts){
            order.AutoPartsSoldAmounts.Add(new AutoPartSoldAmount(){
                AutoPartId = autoPart.Id,
                SoldAmount = autoPart.Amount
            });
        }
        
        AutoPart[] parts = await _appDbContext.AutoParts
            .Where(ap => orderSummary.OrderedParts.Select(op => op.Id).Contains(ap.Id))
            .Select(ap => ap)
            .ToArrayAsync();
        foreach(AutoPart autoPart in parts){
            autoPart.Amount -= orderSummary.OrderedParts
                .Where(ap => ap.Id == autoPart.Id)
                .First().Amount;
        }

        await _appDbContext.Orders.AddAsync(order);
        await _appDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet()]
    [Route("orders/all")]
    public async Task<IEnumerable<Order>> GetOrders(){
        return await _appDbContext.Orders
            .OrderByDescending(o => o.CreatedOn)
            .Select(o => o)
            .ToArrayAsync();
    }

    [HttpGet()]
    [Route("orders/{id:int}")]
    public async Task<Object> GetOrder(int id){
        var result = await _appDbContext.Orders
            .Where(order => order.Id == id)
            .Include(order => order.AutoPartsSoldAmounts)
                .ThenInclude(sa => sa.AutoPart)
            .Select(o => new {
                id = o.Id,
                totalPriceInKzt = o.TotalPriceInKzt,
                soldParts = o.AutoPartsSoldAmounts.Select(sa => new {
                    soldPart = sa.AutoPart,
                    soldAmount = sa.SoldAmount
                }).ToArray()
            })
            .SingleOrDefaultAsync();

        if(result is null){
            return BadRequest(new ProblemDetails(){
                Type = null,
                Status = StatusCodes.Status400BadRequest,
                Title = "Not found.",
                Detail = "The requested resource wasn't found. Possibly removed from the database.",
                Instance = null
            });
        }
        return result;
    }
}