local modules = {}
modules.NewBatwoman = require(script.NewBatwoman)

batwoman = modules.NewBatwoman:new({Name = "Kate Kane"});
batwoman:speak();