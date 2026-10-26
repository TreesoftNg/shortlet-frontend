'use client';

import { ApiError } from '@/data/api/http';
import { useCreateReview } from '@/data/hooks';
import type { Booking } from '@/data/types';
import { AppButton } from '@/shared/components';
import {
  Box,
  Dialog,
  Flex,
  Portal,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type LeaveReviewDialogProps = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function reviewErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'RESOURCE_CONFLICT' || error.status === 409) {
      return 'You already left a review for this stay.';
    }
    if (error.code === 'AUTHENTICATION_REQUIRED' || error.status === 401) {
      return 'Sign in again to leave a review.';
    }
    if (error.code === 'RESOURCE_NOT_FOUND' || error.status === 404) {
      return 'This stay could not be found for review.';
    }
    return error.message || 'Could not submit your review.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Could not submit your review.';
}

export function LeaveReviewDialog({
  booking,
  open,
  onOpenChange,
}: LeaveReviewDialogProps) {
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetMutation = createReview.reset;

  useEffect(() => {
    if (!open) return;
    setRating(0);
    setHoverRating(0);
    setComment('');
    setError(null);
    setSubmitted(false);
    resetMutation();
  }, [open, booking?.id, resetMutation]);

  const displayRating = hoverRating || rating;
  const canSubmit =
    Boolean(booking?.id && booking.unit_id) &&
    rating >= 1 &&
    rating <= 5 &&
    !createReview.isPending &&
    !submitted;

  async function handleSubmit() {
    if (!booking?.id || !booking.unit_id || !canSubmit) return;
    setError(null);
    try {
      await createReview.mutateAsync({
        bookingId: booking.id,
        unitId: booking.unit_id,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      setError(reviewErrorMessage(err));
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.48)" />
        <Dialog.Positioner px="16px">
          <Dialog.Content
            bg="white"
            borderRadius="16px"
            maxW="440px"
            w="full"
            shadow="lg"
            p={0}
            overflow="hidden"
          >
            <Flex
              align="center"
              justify="space-between"
              px="20px"
              pt="18px"
              pb="8px"
            >
              <Dialog.Title asChild>
                <Text fontSize="18px" fontWeight="700">
                  {submitted ? 'Thanks for your review' : 'Leave a review'}
                </Text>
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Box
                  as="button"
                  aria-label="Close"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="36px"
                  h="36px"
                  borderRadius="10px"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  color="ink"
                  _hover={{ bg: 'bg.soft' }}
                >
                  <X size={18} strokeWidth={1.9} />
                </Box>
              </Dialog.CloseTrigger>
            </Flex>

            <Dialog.Body px="20px" pb="20px" pt="8px">
              {booking ? (
                <Text color="ink.2" fontSize="14px" mb="16px">
                  {booking.property_name}
                  {booking.dates_range_label
                    ? ` · ${booking.dates_range_label}`
                    : ''}
                </Text>
              ) : null}

              {submitted ? (
                <Box>
                  <Text color="ink.2" fontSize="14px" mb="18px">
                    Your review was submitted and is pending publication.
                  </Text>
                  <AppButton
                    variant="ink"
                    fullWidth
                    onClick={() => onOpenChange(false)}
                  >
                    Done
                  </AppButton>
                </Box>
              ) : (
                <Box>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.04em"
                    mb="8px"
                  >
                    Rating
                  </Text>
                  <Flex gap="4px" mb="16px" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const active = value <= displayRating;
                      return (
                        <Box
                          key={value}
                          as="button"
                          role="radio"
                          aria-checked={rating === value}
                          aria-label={`${value} star${value === 1 ? '' : 's'}`}
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          w="40px"
                          h="40px"
                          borderRadius="10px"
                          bg="transparent"
                          border="none"
                          cursor="pointer"
                          color={active ? 'ink' : 'ink.3'}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(value)}
                        >
                          <Star
                            size={22}
                            fill={active ? 'currentColor' : 'none'}
                            strokeWidth={1.7}
                          />
                        </Box>
                      );
                    })}
                  </Flex>

                  <Box
                    border="1px solid"
                    borderColor="#D5D5D0"
                    borderRadius="12px"
                    px="16px"
                    py="12px"
                    mb="14px"
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.04em"
                      mb="2px"
                    >
                      Comment (optional)
                    </Text>
                    <Textarea
                      unstyled
                      placeholder="What stood out about your stay?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={2000}
                      fontSize="15px"
                      color="ink"
                      _placeholder={{ color: 'ink.3' }}
                      rows={3}
                      resize="none"
                      w="full"
                      outline="none"
                    />
                  </Box>

                  {!booking?.unit_id ? (
                    <Text color="danger" fontSize="14px" mb="12px">
                      This stay is missing a unit id, so a review cannot be
                      submitted yet.
                    </Text>
                  ) : null}

                  {error ? (
                    <Text color="danger" fontSize="14px" mb="12px">
                      {error}
                    </Text>
                  ) : null}

                  <AppButton
                    variant="ink"
                    fullWidth
                    disabled={!canSubmit}
                    onClick={() => {
                      void handleSubmit();
                    }}
                  >
                    {createReview.isPending ? 'Submitting…' : 'Submit review'}
                  </AppButton>
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
