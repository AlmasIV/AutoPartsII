using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using AutoPartsApi.Models;
using AutoPartsApi.DTOs;
using AutoPartsApi.Filters;

namespace AutoPartsApi.Controllers;

[ApiController()]
[Route("auto-parts")]
public class AutoPartController : ControllerBase {
    private readonly AppDbContext _appDbContext;
    public AutoPartController(AppDbContext appDbContext, ProblemDetailsFactory problemDetailsFactory){
        _appDbContext = appDbContext;
    }

    [HttpGet]
    [Route("all")]
    public async Task<IEnumerable<AutoPart>> GetAll(){
        return await _appDbContext.AutoParts.Select(x => x).ToArrayAsync();
    }

    [HttpPost]
    [Route("create")]
    public async Task Post([FromBody] AutoPart autoPart){
        await _appDbContext.AutoParts.AddAsync(autoPart);
        await _appDbContext.SaveChangesAsync();
    }

    [HttpPost]
    [Route("order")]
    [TypeFilter(typeof(OrderSummaryValidationAttribute))]
    public async Task<IActionResult> Post([FromBody]OrderSummary orderSummary){
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

        return new OkResult();
    }
}