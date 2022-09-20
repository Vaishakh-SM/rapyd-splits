# Getting Started

This guide outlines how to get started with RapydSplits

## Login

Simply login with Google from our homepage (Yes, its that easy!)

## Adding Rapyd EWallet

Once you are at the home page, you should see a few tabs on the left. Click on the settings tab to configure EWallet IDs. You will need one to integrate with RapydSplits

Once there, click on the "Add EWallet" button and enter the EWallet ID in the slider that pops up. You can get your EWallet ID from the Rapyd Dashboard. Once you have entered the EWallet ID, click on the "Add" button to save it.

## Integrating with RapydSplits

Once you have added your EWallet ID, you can now integrate with RapydSplits. Click on the "Integrate" tab on the left. Here you will see some instructions on how to integrate.

Following the aforementioned instructions, click on the dropdown and select the EWallet ID added earlier. Some new fields should appear. You can simply press copy to copy the integration link.

> **Note**: This link does not have total amount and will throw an error if called directly, please interpolate the amount in this link in space given for proper functionality

## RapydSplits in Action

Once you have integrated with RapydSplits, you can now use it in your application. Here is a sample code snippet to get you started:

```tsx
function Cart(amount: number) {
  return (
    <>
      <Button
        onClick={() => {
          window.location.href = `https://rapydsplits.live/api/room/create?ewallet=ewallet_77542f12b97ef00beaacb3b6cfcc3811&amount=${amount}&userId=YJH8FkLbsRflRkJE0NRqKxt6CX43`;
        }}
      >
        Split Pay
      </Button>
    </>
  );
}
```

That's about it for integration. The rest would happen on the room, which is created and the initator is redirected to.
