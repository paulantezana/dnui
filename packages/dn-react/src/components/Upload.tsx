import { forwardRef, useId, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'

export interface UploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Url de la imagen ya cargada. Si hay, se muestra en lugar del area vacia. */
  value?: string
  /** Recorte circular (`.ImageUpload.radio`). */
  circle?: boolean
  label?: ReactNode
  overlayLabel?: ReactNode
  alt?: string
  onFileChange?(file: File | null, event: ChangeEvent<HTMLInputElement>): void
}

/** Subida de una imagen con vista previa, sobre el markup de `upload.css`. */
export const Upload = forwardRef<HTMLInputElement, UploadProps>(function Upload(
  {
    value,
    circle,
    label = 'Subir imagen',
    overlayLabel = 'Cambiar',
    alt = '',
    onFileChange,
    className,
    id,
    accept = 'image/*',
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hasImage = Boolean(value)

  return (
    <div className={cx('ImageUpload', circle && 'radio', className)}>
      <label className={cx('ImageUpload-label', hasImage && 'has-image')} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null, event)}
          {...rest}
        />

        {hasImage ? (
          <>
            <span className="ImageUpload-overlay">{overlayLabel}</span>
            <img src={value} alt={alt} />
          </>
        ) : (
          <span className="ImageUpload-area">
            <span className="ImageUpload-icon">
              <span className="upload-icon icon icon-plus" aria-hidden="true" />
              {label}
            </span>
          </span>
        )}
      </label>
    </div>
  )
})
