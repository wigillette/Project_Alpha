local Batwoman = {};

function Batwoman:new(object)
    setmetatable(object, self);
    self.__index = self;
    self.Name = object.Name;

    return object
end

function Batwoman:speak()
    print(("New look? New %s!"):format(self.Name))
end



return Batwoman