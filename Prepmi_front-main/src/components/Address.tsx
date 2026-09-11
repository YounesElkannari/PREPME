import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { updatePlanData } from "@/store/slices/joinProcessSlice"
import {
  User,
  Phone,
  MapPin,
  Truck,
  Clock,
  Mail,
  Lock,
  Shield,
} from "lucide-react"
import { useTranslation } from "react-i18next"

const hearAboutUsOptions = [
  { value: "google", label: "Google Search" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "Friend/Family" },
  { value: "advertisement", label: "Advertisement" },
  { value: "other", label: "Other" },
]

/** 06/07XXXXXXXX (local) ou +212 6/7XXXXXXXX (international, sans 0 après 212) */
const isValidMoroccanPhone = (phone: string): boolean => {
  const clean = String(phone || "").replace(/\D/g, "")
  if (/^0[67]\d{8}$/.test(clean)) return true
  if (/^212[67]\d{8}$/.test(clean)) return true
  return false
}

export function Address({
  deliverySlotsData = [],
  membershipData = null,
  isLoadingDeliverySlots = false,
}: {
  deliverySlotsData?: any[]
  membershipData?: any
  isLoadingDeliverySlots?: boolean
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const planData = useSelector(
    (state: RootState) => state.joinProcess.planData
  )
  const admin = useSelector((state: RootState) => state.admin)

  const filteredDeliverySlots = deliverySlotsData.filter((slot: any) => {
    if (!slot.is_active) return false

    const hasActiveMembership =
      membershipData && membershipData.status === "active"

    if (hasActiveMembership) {
      return slot.slot_type === "membership" || slot.slot_type === "both"
    }

    return slot.slot_type === "normal" || slot.slot_type === "both"
  })

  const [addressData, setAddressData] = useState({
    firstName: planData?.firstName || "",
    lastName: planData?.lastName || "",
    phoneNumber: planData?.phoneNumber || "",
    country: planData?.country || "",
    address: planData?.address || "",
    hearAboutUs: planData?.hearAboutUs || "",
    email: planData?.email || "",
    password: "",
    repeatPassword: "",
  })

  const [phoneError, setPhoneError] = useState("")

  const [selectedDeliverySlots, setSelectedDeliverySlots] = useState<number[]>(
    (planData?.delivery_slot_ids || []).map((id: any) => Number(id))
  )

  const [isManualAddress, setIsManualAddress] = useState(true)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!planData) return

    setAddressData((prev) => ({
      ...prev,
      firstName: planData.firstName || "",
      lastName: planData.lastName || "",
      phoneNumber: planData.phoneNumber || "",
      country: planData.country || "UK",
      address: planData.address || "",
      hearAboutUs: planData.hearAboutUs || "",
      email: planData.email || "",
    }))
  }, [
    planData?.firstName,
    planData?.lastName,
    planData?.phoneNumber,
    planData?.country,
    planData?.address,
    planData?.hearAboutUs,
    planData?.email,
  ])

  // Prefill from logged-in profile only when fields are empty
  useEffect(() => {
    const user = admin?.user
    const isLoggedIn = user && user.id && user.id > 0

    if (!isLoggedIn || !planData) return

    const fieldsToPrefill: Record<string, string> = {}

    if (!planData.firstName && user.first_name) {
      fieldsToPrefill.firstName = user.first_name
    }
    if (!planData.lastName && user.last_name) {
      fieldsToPrefill.lastName = user.last_name
    }
    if (!planData.phoneNumber && user.phone) {
      fieldsToPrefill.phoneNumber = user.phone
    }
    if (!planData.address && user.address) {
      fieldsToPrefill.address = user.address
    }
    if (!planData.email && user.email) {
      fieldsToPrefill.email = user.email
    }

    if (Object.keys(fieldsToPrefill).length > 0) {
      dispatch(updatePlanData(fieldsToPrefill))
    }
  }, [
    admin?.user?.id,
    admin?.user?.first_name,
    admin?.user?.last_name,
    admin?.user?.phone,
    admin?.user?.address,
    admin?.user?.email,
    planData?.firstName,
    planData?.lastName,
    planData?.phoneNumber,
    planData?.address,
    planData?.email,
    dispatch,
  ])

  const handleInputChange = (field: string, value: string) => {
    if (field === "phoneNumber") {
      setPhoneError("")
      if (value && !isValidMoroccanPhone(value)) {
        setPhoneError(
          "Format invalide. Ex: 0612345678 ou +212612345678 (06 ou 07)"
        )
      }
    }
    setAddressData((prev) => ({ ...prev, [field]: value }))
    dispatch(updatePlanData({ [field]: value }))
  }

  const handleDeliverySlotToggle = (slotId: number) => {
    const id = Number(slotId)
    const hasActiveMembership =
      membershipData && membershipData.status === "active"

    let updatedSlots: number[]

    if (selectedDeliverySlots.includes(id)) {
      updatedSlots = selectedDeliverySlots.filter((x) => x !== id)
    } else if (hasActiveMembership) {
      if (selectedDeliverySlots.length >= 2) return
      updatedSlots = [...selectedDeliverySlots, id]
    } else {
      updatedSlots = [id]
    }

    setSelectedDeliverySlots(updatedSlots)
    dispatch(updatePlanData({ delivery_slot_ids: updatedSlots }))
  }

  const handleAddressSearch = (query: string) => {
    setAddressData((prev) => ({ ...prev, address: query }))

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (!query || query.length < 3) {
      setAddressSuggestions([])
      return
    }

    setIsLoadingSuggestions(true)
    searchTimeoutRef.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddressSuggestions(data.map((item: any) => item.display_name))
          setIsLoadingSuggestions(false)
        })
        .catch(() => {
          setAddressSuggestions([])
          setIsLoadingSuggestions(false)
        })
    }, 400)
  }

  const isFormValid = () => {
    const basicValid =
      !!addressData.firstName &&
      !!addressData.lastName &&
      !!addressData.phoneNumber &&
      !!addressData.address &&
      selectedDeliverySlots.length > 0 &&
      isValidMoroccanPhone(addressData.phoneNumber)

    const isLoggedIn = admin?.user && admin.user.id && admin.user.id > 0

    if (!isLoggedIn) {
      return (
        basicValid &&
        !!addressData.email &&
        !!addressData.password &&
        addressData.password === addressData.repeatPassword
      )
    }

    return basicValid
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground">
          {t("joinNow.address.title")}
        </h2>
        <p className="text-muted-foreground">{t("joinNow.address.subtitle")}</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>{t("joinNow.address.personalInformation")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("joinNow.address.firstName")} *</Label>
              <Input
                id="firstName"
                type="text"
                value={addressData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={t(
                  "joinNow.address.firstNamePlaceholder",
                  "Enter your first name"
                )}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t("joinNow.address.lastName")} *</Label>
              <Input
                id="lastName"
                type="text"
                value={addressData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={t(
                  "joinNow.address.lastNamePlaceholder",
                  "Enter your last name"
                )}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                {t("joinNow.address.phoneNumber")} *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={addressData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="0612345678 ou +212612345678"
                  className={`pl-10 ${phoneError ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-sm text-red-500">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Format accepté: 06/07XXXXXXXX ou +212 6/7XXXXXXXX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account — guests only */}
      {!admin?.user?.id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>{t("joinNow.address.accountInformation")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("joinNow.address.email")} *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={addressData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t(
                    "joinNow.address.emailPlaceholder",
                    "Enter your email"
                  )}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">{t("joinNow.address.password")} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={addressData.password}
                    onChange={(e) => {
                      const value = e.target.value
                      setAddressData((prev) => ({ ...prev, password: value }))
                      dispatch(updatePlanData({ password: value }))
                    }}
                    placeholder={t(
                      "joinNow.address.passwordPlaceholder",
                      "Enter your password"
                    )}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repeatPassword">
                  {t("joinNow.address.repeatPassword")} *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="repeatPassword"
                    type="password"
                    value={addressData.repeatPassword}
                    onChange={(e) => {
                      const value = e.target.value
                      setAddressData((prev) => ({
                        ...prev,
                        repeatPassword: value,
                      }))
                      dispatch(updatePlanData({ repeatPassword: value }))
                    }}
                    placeholder={t(
                      "joinNow.address.repeatPasswordPlaceholder",
                      "Repeat your password"
                    )}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{t("joinNow.address.deliveryAddress")} *</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {!isManualAddress ? (
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={addressData.address}
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    placeholder={t(
                      "joinNow.address.addressSearch",
                      "Start typing your address..."
                    )}
                    className="pl-10"
                    autoComplete="off"
                  />
                  {isLoadingSuggestions && (
                    <div className="absolute left-0 right-0 top-full z-10 border bg-white p-2 text-sm">
                      {t("joinNow.address.loading", "Searching...")}
                    </div>
                  )}
                  {addressSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full z-10 mt-1 rounded border bg-white shadow">
                      {addressSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="cursor-pointer px-3 py-2 hover:bg-primary/10"
                          onClick={() => {
                            setAddressData((prev) => ({
                              ...prev,
                              address: suggestion,
                            }))
                            setAddressSuggestions([])
                            dispatch(updatePlanData({ address: suggestion }))
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsManualAddress(true)}
                  className="h-auto p-0 font-normal text-primary"
                >
                  {t("joinNow.address.manualEntry")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  type="text"
                  value={addressData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder={t(
                    "joinNow.address.fullAddress",
                    "Enter your full address"
                  )}
                />
                <Button
                  variant="ghost"
                  onClick={() => setIsManualAddress(false)}
                  className="h-auto p-0 font-normal text-primary"
                >
                  {t("joinNow.address.searchAddress")}
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  {t("joinNow.address.freshness")}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  {t("joinNow.address.updates")}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  {t("joinNow.address.delivery")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>
              {t(
                "joinNow.address.deliverySlots",
                "Select Delivery TimeSlots"
              )}{" "}
              *
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingDeliverySlots ? (
            <p className="py-4 text-center text-muted-foreground">
              {t("joinNow.address.loadingSlots", "Loading delivery slots...")}
            </p>
          ) : filteredDeliverySlots.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              {t("joinNow.address.noSlots", "No delivery slots available")}
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t(
                  "joinNow.address.selectSlotsDescription",
                  "Select your preferred delivery time slots"
                )}
              </p>

              {membershipData && membershipData.status === "active" ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-800">
                    {t(
                      "joinNow.address.membershipMultipleSlots",
                      "✨ As a member, you can select up to 2 delivery slots!"
                    )}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">
                    {t(
                      "joinNow.address.nonMemberSingleSlot",
                      "You can select one delivery slot. Upgrade to membership to select up to 2 slots."
                    )}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredDeliverySlots.map((slot: any) => {
                  const slotId = Number(slot.id)
                  const isSelected = selectedDeliverySlots.includes(slotId)

                  const maxCap = Number(slot.max_capacity ?? 0)
                  const bookings = Number(slot.current_bookings ?? 0)
                  const isFull = maxCap > 0 && bookings >= maxCap

                  const hasActiveMembership =
                    membershipData && membershipData.status === "active"
                  const isMaxSlotsReached =
                    hasActiveMembership &&
                    selectedDeliverySlots.length >= 2 &&
                    !isSelected
                  const isDisabled = isFull || isMaxSlotsReached

                  return (
                    <div
                      key={slotId}
                      role="button"
                      tabIndex={0}
                      className={`relative select-none rounded-lg border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${
                        isDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!isDisabled) handleDeliverySlotToggle(slotId)
                      }}
                      onKeyDown={(e) => {
                        if (
                          !isDisabled &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault()
                          handleDeliverySlotToggle(slotId)
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          className="pointer-events-none mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-foreground">
                              {t(
                                `joinNow.address.days.${slot.day_of_week}`,
                                [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ][Number(slot.day_of_week)] || "—"
                              )}
                            </h4>
                            {isFull && (
                              <span className="text-xs font-medium text-red-500">
                                Complet
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selectedDeliverySlots.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  {t(
                    "joinNow.address.selectAtLeastOneSlot",
                    "Please select at least one delivery slot"
                  )}
                </p>
              )}

              {membershipData &&
                membershipData.status === "active" &&
                selectedDeliverySlots.length === 2 && (
                  <p className="mt-2 text-sm text-green-600">
                    {t(
                      "joinNow.address.maxSlotsReached",
                      "✓ Maximum slots selected (2/2)"
                    )}
                  </p>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("joinNow.address.hearAbout")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={addressData.hearAboutUs}
            onValueChange={(value) => handleInputChange("hearAboutUs", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("joinNow.address.selectSource")} />
            </SelectTrigger>
            <SelectContent>
              {hearAboutUsOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!isFormValid() && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("joinNow.address.requiredFields")}
          </p>
        </div>
      )}
    </div>
  )
}