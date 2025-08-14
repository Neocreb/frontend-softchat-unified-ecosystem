<Card
  className={cn(
    "rounded-2xl shadow-lg overflow-hidden border-0",
    "bg-[linear-gradient(110deg,#2951d6_0%,#8145e6_100%)]",
    className
  )}
  style={{
    background: "linear-gradient(110deg,#2951d6 0%,#8145e6 100%)",
  }}
>
  <CardContent className="p-6 flex flex-col h-full">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Sparkles className="text-yellow-400" />
      <div>
        <h2 className="text-lg font-bold text-gray-900">Crypto Wallet</h2>
        <p className="text-sm text-gray-700">Digital asset portfolio</p>
      </div>
    </div>
    {/* Main */}
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-xs text-gray-600">Total Portfolio Value</div>
      <div className="text-4xl font-extrabold text-gray-900">$125,670.45</div>
      <div className="flex items-center gap-2 mt-2">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span className="text-green-600 text-lg font-semibold">
          $3,240.78
        </span>
        <span className="text-green-600 text-base">
          (+2.64%) 24h
        </span>
      </div>
    </div>
    {/* Buttons */}
    <div className="flex justify-end mt-6 gap-2">
      <Button className="bg-green-600 hover:bg-green-700 text-white">Deposit</Button>
      <Button className="bg-orange-500 hover:bg-orange-600 text-white">Withdraw</Button>
    </div>
  </CardContent>
</Card>
