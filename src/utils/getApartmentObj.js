const getApartmentObj = (apartment, apartmentProps, publishersArr) => {
  const publishers = [];
  for (const publisher of publishersArr || []) {
    publishers.push({
      publisherName: publisher.PublisherName,
      phoneNumber: publisher.PhoneNumber,
    });
  }

  const props = [];
  apartmentProps.forEach((prop) => {
    props.push(prop.PropertyName);
  });

  return {
    type: apartment.Type,
    condition: apartment.Condition,
    location: {
      town: apartment.Town,
      streetName: apartment.Street,
      houseNum: apartment.HouseNum,
      floor: apartment.FloorNum,
      buildingMaxFloor: apartment.BuildingMaxFloor,
    },
    properties: {
      isStandingOnPolls: props.includes("IsStandingOnPolls"),
      numberOfRooms: apartment.NumberOfRooms,
      numberOfParkingSpots: apartment.NumberOfParkingSpots,
      numberOfBalconies: apartment.NumberOfBalconies,
      hasAirConditioning: props.includes("HasAirConditioning"),
      hasFurniture: props.includes("HasFurniture"),
      isRenovated: props.includes("IsRenovated"),
      hasSafeRoom: props.includes("HasSafeRoom"),
      isAccessible: props.includes("IsAccessible"),
      hasKosherKitchen: props.includes("HasKosherKitchen"),
      hasShed: props.includes("HasShed"),
      hasLift: props.includes("HasLift"),
      hasSunHeatedWaterTanks: props.includes("HasSunHeatedWaterTanks"),
      hasPandorDoors: props.includes("HasPandorDoors"),
      hasTadiranAc: props.includes("HasTadiranAc"),
      hasWindowBars: props.includes("HasWindowBars"),
      description: apartment.ApartmentDescription,
      furnitureDescription: apartment.FurnitureDescription,
    },
    price: apartment.Price,
    size: {
      builtSqm: apartment.BuiltSqm,
      totalSqm: apartment.TotalSqm,
    },
    entranceDate: {
      date: apartment.EntranceDate,
      isImmediate: !!apartment.IsEntranceImmediate ? true : false,
    },
    publishers: publishers || [],
    contactEmail: apartment.Email,
    publisher: apartment.PublisherUserID,
    _id: apartment.ApartmentID,
  };
};

module.exports = getApartmentObj;
